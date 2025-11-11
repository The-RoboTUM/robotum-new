// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import Button from "../Button";

// test("renders primary button and handles click", async () => {
//   const onClick = vi.fn();
//   render(
//     <Button variant="primary" onClick={onClick}>
//       Click me
//     </Button>,
//   );
//   const btn = screen.getByRole("button", { name: /click me/i });
//   await userEvent.click(btn);
//   expect(onClick).toHaveBeenCalledTimes(1);
//   expect(btn).toHaveClass("btn-primary"); // or your expected classes
// });
