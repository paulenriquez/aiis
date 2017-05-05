class PurchaseOrder < ApplicationRecord
    has_many :order_lines, inverse_of: :purchase_order
    has_many :products, through: :order_lines
    has_many :customer_payments
    belongs_to :customer_account

    accepts_nested_attributes_for :order_lines

    before_save :generate_purchase_order_number

    private
        def generate_purchase_order_number
            self.po_num = 'PO-' + self.customer_account_id.to_s + '-' + self.purchase_date.to_s.gsub('-', '') + '-' + (PurchaseOrder.last.id + 1).to_s
        end
end