export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MediChat Assist. All rights reserved.</p>
        <p className="text-xs mt-1">This tool is for informational purposes only and not a substitute for professional medical advice.</p>
      </div>
    </footer>
  );
}
