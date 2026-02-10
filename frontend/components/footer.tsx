export function Footer() {
    return (
        <footer className="border-t border-stone-100 bg-white py-12 text-center text-sm text-ink/40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p>&copy; {new Date().getFullYear()} HanaDiary. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="hover:text-ink/60">Privacy</a>
                    <a href="#" className="hover:text-ink/60">Terms</a>
                    <a href="#" className="hover:text-ink/60">Contact</a>
                </div>
            </div>
        </footer>
    );
}
