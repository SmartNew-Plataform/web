export type UserData = {
  login: string
  name: string
  clientId: string
  group: {
    description: string
    id: number
  }
}

export interface Permission {
  access: boolean
  update: boolean
  delete: boolean
  export: boolean
  print: boolean
}

export interface Children {
  value: number
  application: string
  icon: string
  label: string
  order: number
  access: boolean
  permission: Permission
  children: Array<Children>
}

export interface Menu {
  value: number
  application: string
  icon: string
  label: string
  access: boolean
  order: number
  permission: Permission
  children: Children[]
}

export type ModuleData = {
  icon: string
  name: string
  id: number
  order: number
  access: boolean
  menu: Array<Menu>
}
