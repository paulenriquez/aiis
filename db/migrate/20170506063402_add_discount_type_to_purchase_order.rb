class AddDiscountTypeToPurchaseOrder < ActiveRecord::Migration[5.0]
  def change
    add_column :purchase_orders, :discount_type, :string
  end
end
