import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";
import { catchError, Observable, of, tap } from "rxjs";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  inject(AuthService).checkStatus().pipe(
    tap((resp) => console.log(resp)),
    catchError((error: Error) => {
      console.log(error.message);
      return of(false);
    })
  );
  return next(req);
}
