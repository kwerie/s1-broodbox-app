export default function AuthLayout({ children }: LayoutProps<"/">) {
    return <div className="flex flex-1 flex-col">{children}</div>;
}
