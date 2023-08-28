import { MoreVertical } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'

function MoreOptionsButton() {
  return (
    <button className=" rounded-full border-0 border-transparent p-2 transition hover:bg-zinc-100 focus:outline-none">
      <MoreVertical className="h-4 w-4" />
    </button>
  )
}

export default function Web() {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4">
      <DataTable columns={columns} data={[]} globalFilter={''} />
      {/* <Table className="bg-white text-lg">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHeadWithIcon>ID</TableHeadWithIcon>
            <TableHeadWithIcon>
              <HelpCircle className="h-4 w-4" />
              Status
            </TableHeadWithIcon>
            <TableHeadWithIcon>
              <Text className="h-4 w-4" />
              Descrição
            </TableHeadWithIcon>
            <TableHeadWithIcon>
              <User className="h-4 w-4" />
              Usuário
            </TableHeadWithIcon>
            <TableHeadWithIcon>
              <Calendar className="h-4 w-4" />
              Data
            </TableHeadWithIcon>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>279062</TableCell>
            <TableCell>
              <Lock className="h-5 w-5 text-red-500" />
            </TableCell>
            <TableCell>CAMINHÃO MUNICK</TableCell>
            <TableCell>bruno.matias</TableCell>
            <TableCell>21/08/2023 15:22</TableCell>
            <TableCell>
              <MoreOptionsButton />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>279062</TableCell>
            <TableCell>
              <Lock className="h-5 w-5 text-red-500" />
            </TableCell>
            <TableCell>CAMINHÃO MUNICK</TableCell>
            <TableCell>bruno.matias</TableCell>
            <TableCell>21/08/2023 15:22</TableCell>
            <TableCell>
              <MoreOptionsButton />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table> */}
    </div>
  )
}
