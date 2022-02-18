import { Observable } from 'rxjs'
import { UserById } from './demo.interface'

interface UserService {
  findOne(data: UserById): Observable<any>
}

export default UserService
