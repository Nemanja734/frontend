import clsx from "clsx"

interface Props {
    level: string,
    customs?: string,
    children: React.ReactNode
}

export default function Text({ level, customs, children }: Props) {
    const styles: Record<string, string> = {
        "2xl": "text-4xl font-semibold",
        xl: "text-2xl font-semibold",
        base: "text-base leading-[1.5]",
        sm: "text-sm leading-[1.5]",
    }

    return(
        <div className={clsx(styles[level], customs)}>{children}</div>
    )
}