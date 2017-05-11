class Product < ApplicationRecord
    has_many :order_lines
    has_many :purchase_orders, through: :order_lines
    has_many :inventory_histories

    def remaining_quantity
        result = 0
        self.inventory_histories.each do |inventory_history|
            if inventory_history.action_type.downcase == 'in'
                result += inventory_history.quantity
            else
                result -= inventory_history.quantity
            end
        end
        return result
    end
end