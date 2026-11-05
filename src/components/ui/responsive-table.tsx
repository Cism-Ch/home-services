import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface ColumnDef<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
  mobileCard?: (item: T) => React.ReactNode
  className?: string
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "Aucune donnée disponible",
  mobileCard,
  className,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl bg-card/40 text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Mobile Card View (visible below md) */}
      <div className="grid gap-3 md:hidden">
        {data.map((item) => {
          const key = keyExtractor(item)
          if (mobileCard) {
            return <React.Fragment key={key}>{mobileCard(item)}</React.Fragment>
          }

          return (
            <Card key={key} className="shadow-xs border bg-card">
              <CardContent className="p-4 space-y-2.5">
                {columns.map((col, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm gap-2">
                    <span className="text-muted-foreground font-medium shrink-0">
                      {col.header}
                    </span>
                    <span className={cn("font-medium text-right truncate", col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Desktop Table View (visible on md and above) */}
      <div className="hidden md:block overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={cn("px-4 py-3.5", col.className)}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="transition-colors hover:bg-muted/40"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn("px-4 py-3.5 align-middle", col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
