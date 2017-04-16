class CreateCustomerAccounts < ActiveRecord::Migration[5.0]
  def change
    create_table :customer_accounts do |t|
      t.string :customer_name
      
      t.string :address
      t.string :email
      t.string :telephone_number
      t.string :fax_number

      t.timestamps
    end
  end
end
