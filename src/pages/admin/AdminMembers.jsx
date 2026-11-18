// src/pages/admin/AdminMembers.jsx
// Member registry: Teams / Memberships / Status / Directory tabs, each with its
// own editor. The active tab lives in ?tab= so reloads and links keep it.
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@components/admin/AdminLayout";
import AdminBanner from "@components/admin/AdminBanner";
import AdminTabs, { AdminTabPanel } from "@components/admin/AdminTabs";
import TeamsTab from "@components/admin/members/TeamsTab";
import MembershipsTab from "@components/admin/members/MembershipsTab";
import StatusTab from "@components/admin/members/StatusTab";
import DirectoryTab from "@components/admin/members/DirectoryTab";
import { useAsyncData } from "@hooks/useAsyncData";
import { useEnumOptions } from "@hooks/useEnumOptions";
import {
  adminFetchMembersRegistry,
  CURRENT_MEMBER_STATUSES,
  ENUM_TYPES,
  MEMBER_STATUS_ACTIVE,
  MEMBER_STATUS_DELETED,
} from "@data";

const TAB_IDS = ["teams", "memberships", "status", "directory"];
const ID_PREFIX = "members";
const EMPTY_REGISTRY = { members: [], projects: [], departments: [] };

export default function AdminMembers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = TAB_IDS.includes(requestedTab) ? requestedTab : TAB_IDS[0];

  const [successMsg, setSuccessMsg] = useState("");
  const [actionError, setActionError] = useState("");

  // Admin needs every membership type (the public allowlist hides some).
  const { options: membershipOptions } = useEnumOptions(
    ENUM_TYPES.MEMBERSHIP_TYPE,
    { includeAll: true },
  );
  const { options: statusOptions } = useEnumOptions(ENUM_TYPES.MEMBER_STATUS);

  const { data, loading, error, reload } = useAsyncData(
    adminFetchMembersRegistry,
    [],
    { errorMessage: "Failed to load members. Has the member_status migration been applied?" },
  );
  const registry = data ?? EMPTY_REGISTRY;
  const { members } = registry;

  const tabs = useMemo(() => {
    const roster = members.filter((m) => m.status !== MEMBER_STATUS_DELETED);
    return [
      {
        id: "teams",
        label: "Teams",
        count: members.filter((m) => m.status === MEMBER_STATUS_ACTIVE).length,
      },
      {
        id: "memberships",
        label: "Memberships",
        count: roster.filter((m) => m.memberships.length > 0).length,
      },
      {
        id: "status",
        label: "Status",
        count: members.filter((m) => !CURRENT_MEMBER_STATUSES.includes(m.status)).length,
      },
      { id: "directory", label: "Directory", count: roster.length },
    ];
  }, [members]);

  const changeTab = (tabId) => {
    setSuccessMsg("");
    setActionError("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tabId);
        return next;
      },
      { replace: true },
    );
  };

  const handleSaved = (message) => {
    setActionError("");
    setSuccessMsg(message);
    reload();
  };

  const handleError = (message) => {
    setSuccessMsg("");
    setActionError(message);
  };

  const tabProps = {
    ...registry,
    membershipOptions,
    statusOptions,
    onSaved: handleSaved,
    onError: handleError,
  };

  return (
    <AdminLayout
      title="Members"
      description="Team rosters, club memberships and member status. Changes here are internal; only names, photos and memberships of non-deleted members appear on the public site."
    >
      <AdminBanner message={error || actionError} />
      <AdminBanner message={successMsg} tone="success" />

      <AdminTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={changeTab}
        label="Member views"
        idPrefix={ID_PREFIX}
      />

      {/* Keep showing the previous data while a save-triggered reload runs. */}
      {loading && !data ? (
        <p className="text-sm text-white/60">Loading…</p>
      ) : (
        <AdminTabPanel id={activeTab} idPrefix={ID_PREFIX}>
          {activeTab === "teams" && <TeamsTab {...tabProps} />}
          {activeTab === "memberships" && <MembershipsTab {...tabProps} />}
          {activeTab === "status" && <StatusTab {...tabProps} />}
          {activeTab === "directory" && <DirectoryTab {...tabProps} />}
        </AdminTabPanel>
      )}
    </AdminLayout>
  );
}
