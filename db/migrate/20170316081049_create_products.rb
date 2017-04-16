class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :product_name

      t.string :product_type
      t.string :product_specs
      t.decimal :unit_price

      t.timestamps
    end
  end
end
