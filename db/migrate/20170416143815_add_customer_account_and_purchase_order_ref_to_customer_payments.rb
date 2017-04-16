class AddCustomerAccountAndPurchaseOrderRefToCustomerPayments < ActiveRecord::Migration[5.0]
  def change
    add_reference :customer_payments, :customer_account, index: true, foreign_key: true
    add_reference :customer_payments, :purchase_order, index: true, foreign_key: true
  end
end
