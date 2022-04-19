import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'

@Entity({
  name: 'international_prices',
})
export class InternationalPrice {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  coin: string

  @Column()
  currency: string

  @Column()
  price: string
}
