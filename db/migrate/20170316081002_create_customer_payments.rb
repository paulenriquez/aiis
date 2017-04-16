class CreateCustomerPayments < ActiveRecord::Migration[5.0]
  def change
    create_table :customer_payments do |t|
      t.date :payment_date
      t.decimal :amount_paid

      t.timestamps
    end
  end
end
