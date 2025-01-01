import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"

import Layout from "./components/Layout"

import Login from "./pages/Login"
import Landing from "./pages/Landing"
import SignupStudent from "./pages/Signup"
import Dashboard from "./pages/student/Dashboard"
import StudentSprints from "./pages/student/StudentSprints"
import { AuthProvider } from "./auth/AuthContext"
import StudentProtectedRoute from "./components/StudentProtectedRoute"
import ProfessorProtectedRoute from "./components/ProfessorProtectedRoute"
import ProfessorDashboard from "./pages/professor/ProfessorDashboard"
import TeamCreation from "./pages/professor/TeamCreation"
import Students from "./pages/professor/Students"
import Teams from "./pages/professor/Teams"
import TeamPage from "./pages/professor/TeamPage"
import AddStudents from "./pages/professor/AddStudents"
import RemoveStudents from "./pages/professor/RemoveStudents"

const queryClient = new QueryClient()

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Landing />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/signup-student",
				element: <SignupStudent />,
			},
			{
				element: <StudentProtectedRoute />,
				children: [
					{
						path: "/dashboard",
						element: <Dashboard />,
					},
					{
						path: "/sprints",
						element: <StudentSprints />,
					},
				],
			},
			{
				element: <ProfessorProtectedRoute />,
				children: [
					{
						path: "/professor-dashboard",
						element: <ProfessorDashboard />,
					},
					{
						path: "/team-creation",
						element: <TeamCreation />,
					},
					{
						path: "/students",
						element: <Students />,
					},
					{
						path: "/teams",
						element: <Teams />,
					},
					{
						path: "/teams/:teamId",
						element: <TeamPage />,
						path: "/add-students",
						element: <AddStudents />,
					},
					{
						path: "/remove-students",
						element: <RemoveStudents />,
					},
				],
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
)
