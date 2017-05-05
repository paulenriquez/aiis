class AddDateFulfilledToPurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :purchase_orders, :date_fulfilled, :date
  end
end
