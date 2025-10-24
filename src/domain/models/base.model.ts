export interface BaseResponse<T> {
    data: T;
    success: boolean;
    message: string;
    status: number;
    totalCount: number
    statusCount: number
}

export interface BaseResponseModel<T> {
    data: {
        list: T[],
        totalCount: number;
        statusCount: number;

    };
    success: boolean;
    message: string;
    status: number;
}


export interface CandidateBaseResponse<T, U> extends BaseResponse<T> {
    candidateStatus?: U;  
}

export interface ProjectAttendaceBaseResponse<T, U> extends BaseResponse<T> {
    statusWithCounts?: U;  
}

export interface PfChallanBaseResponse<T, U> extends BaseResponseModel<T> {
    data: {
        list: T[],
        totalCount: number;
        statusCount: number;
        attachments: U[];
    };
}

export interface DynamicApiResponse {
    data: { [key: string]: string }; 
    success: boolean;
    message: string;
    status: number;
}

export interface DynamicArrayApiResponse {
    data: Array<{ [key: string]: string }>; 
    success: boolean;
    message: string;
    totalCount: number;
    status: number;
}
