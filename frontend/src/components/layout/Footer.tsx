export function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">About Us</h3>
                        <p className="text-sm text-muted-foreground">
                            Dedicated to making our community safer through efficient cyber crime reporting.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/about">About</a></li>
                            <li><a href="/faq">FAQ</a></li>
                            <li><a href="/news">News</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Email: support@cybercrime.gov</li>
                            <li>Phone: +880 123-456-789</li>
                            <li>Emergency: 999</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            {/* Social media icons */}
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    © 2025 Cyber Crime Reporting. All rights reserved.
                </div>
            </div>
        </footer>
    )
}