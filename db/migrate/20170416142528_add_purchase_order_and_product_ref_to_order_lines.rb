class AddPurchaseOrderAndProductRefToOrderLines < ActiveRecord::Migration[5.0]
  def change
    add_reference :order_lines, :purchase_order, index: true, foreign_key: true
    add_reference :order_lines, :product, index: true, foreign_key: true
  end
end
