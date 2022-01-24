import { UserById, UserReferredId, UserReferralIds } from './internal.interface'
import { Observable } from 'rxjs'

interface InternalService {
  findParent(data: UserById): Observable<UserReferredId>
  findManyChildren(data: UserById): Observable<UserReferralIds>
}

export default InternalService
