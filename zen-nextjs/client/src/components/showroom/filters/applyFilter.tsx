import Button from "@/ui/button";

interface Props {
    handleReset: () => void
    handleApply: () => void
}

export default function ApplyFilter({handleReset, handleApply}: Props) {
    return(
        <div className="grid grid-cols-2 border-t-1">
            <Button level="stroke-lg" className="p-4! rounded-none! border-none!" onClick={handleReset}>Zurücksetzen</Button>
            <Button level="black-lg" className="p-4! rounded-none! border-none!" onClick={handleApply}>Speichern</Button>
        </div>
    )
}