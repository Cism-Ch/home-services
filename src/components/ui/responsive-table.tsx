import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
      {/* Vue Cartes Mobile (< md) */}
      <div className="grid gap-3 md:hidden">
        {data.map((item) => {
          const key = keyExtractor(item)
          if (mobileCard) {
            return <React.Fragment key={key}>{mobileCard(item)}</React.Fragment>
          }

          const visibleColumns = columns.filter((col) => !col.hideOnMobile)

          return (
            <Card key={key} className="shadow-xs border bg-card">
              <CardContent className="p-4 space-y-3">
                {visibleColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-muted-foreground font-medium shrink-0">
                      {col.header}
                    </span>
                    <div
                      className={cn(
                        "font-medium text-right min-w-0 break-words",
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? "")
                        : null}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Vue Table Desktop (>= md) avec primitives shadcn/ui */}
      <div className="hidden md:block overflow-hidden rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              {columns.map((col, idx) => (
                <TableHead
                  key={idx}
                  className={cn("h-11 px-4 font-semibold", col.className)}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn("px-4 py-3.5 whitespace-normal", col.className)}
                  >
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? "")
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
