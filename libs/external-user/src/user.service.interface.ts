import { Observable } from 'rxjs'
import { UserById } from './user.interface'

interface UserService {
  findOne(data: UserById): Observable<any>
}

export default UserService
