// import { HttpError } from './http-error';

//Opción mas informativa respecto a los errores de cara al cliente de la API

// export type AppResponse<T> = {
//     results: T[];
//     error: HttpError | null;
// };

export type AppResponse<T> = {
    results: T[] | null;
    error: string;
};
