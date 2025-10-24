export interface FilterModel {
    data: Data[]
    totalCount: number
    success: boolean
    message: string
    status: number
}

export interface Data {
    id: number
    screenGridId: number
    codeTypeId: number
    sourceType: string
    controlName: string
    filterData: FilterDaum[]
    filterFor?: string
    selectedValues :string[]
    controlType: string
}

export interface FilterDaum {
    id: number
    codeTypeId: number
    name: string
    enumItem: string
}
