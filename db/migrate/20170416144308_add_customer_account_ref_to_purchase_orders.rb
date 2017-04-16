class AddCustomerAccountRefToPurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    add_reference :purchase_orders, :customer_account, index: true, foreign_key: true
  end
end
