import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Create from "../components/Create";

let mockIsAuthenticated = false;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        email: "profiletest@hotmail.com",
        email_verified: true,
      },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: jest.fn(),
    };
  },
}));

test("renders post page", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Create />
    </MemoryRouter>
  );

  expect(screen.getByText("Submit")).toBeInTheDocument();
});
