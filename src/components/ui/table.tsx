import * as React from 'react'

import { cn } from '@/lib/utils'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="max-h-full w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
<<<<<<< HEAD
  <thead
    ref={ref}
    className={cn('bg-slate-200 [&_tr]:border-b', className)}
    {...props}
  />
=======
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('bg-primary font-medium text-primary-foreground', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
<<<<<<< HEAD
      'border-b transition-colors even:bg-slate-100 hover:bg-muted/50 data-[state=selected]:bg-muted',
=======
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
<<<<<<< HEAD
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
=======
      'h-12 px-6 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0  ',
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'
<<<<<<< HEAD
=======

const TableHeadWithIcon = ({ ...props }) => (
  <TableHead>
    <div className="flex items-center gap-2" {...props} />
  </TableHead>
)
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
<<<<<<< HEAD
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
=======
    className={cn(
      'p-4 px-6 align-middle [&:has([role=checkbox])]:pr-0',
      className,
    )}
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
<<<<<<< HEAD
=======
  TableHeadWithIcon,
>>>>>>> ca65ddc3a56314dd8b57eae65eb21b0cf0e54727
  TableHeader,
  TableRow
}

