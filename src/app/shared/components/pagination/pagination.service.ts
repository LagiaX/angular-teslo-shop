import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private _route: ActivatedRoute = inject(ActivatedRoute);

  public currentPage = toSignal(
    this._route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('page') ? +params.get('page')! : 1),
      map((page: number) => isNaN(page) ? 1 : page)
    ),
    {
      initialValue: 1
    }
  );
}
