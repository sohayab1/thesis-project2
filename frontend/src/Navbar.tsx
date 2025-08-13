import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { auth } from "@/services/api"

export function Navbar() {
    const { user, setUser } = useAuth()

    const logout = async () => {
        await auth.logout()
        setUser(null)
    }

    return (
        <nav className="border-b">
            <div className="container flex h-16 items-center px-4">
                <div className="mr-4 hidden md:flex">
                    <a href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">Cybercrime Reporting</span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {user ? (
                        <>
                            <Button variant="ghost" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button variant="ghost" asChild>
                            <a href="/login">Login</a>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    )
}