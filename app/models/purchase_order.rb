class PurchaseOrder < ApplicationRecord
    has_many :order_lines, inverse_of: :purchase_order, dependent: :destroy
    has_many :products, through: :order_lines
    has_many :customer_payments
    belongs_to :customer_account

    accepts_nested_attributes_for :order_lines, allow_destroy: true

    validates :customer_account_id, presence: true

    before_create :generate_purchase_order_number
    before_save :sanitize_input

    def outstanding_balance
        total_payments = 0;
        self.customer_payments.each do |customer_payment|
            total_payments += customer_payment.amount_paid
        end
        return self.negotiated_price - total_payments
    end

    private
        def generate_purchase_order_number
            self.po_num = 'PO-' + self.customer_account_id.to_s + '-' + CustomerAccount.find(self.customer_account_id).purchase_orders.count.to_s
        end
        def sanitize_input
            # Discount
            if self.discount_type == 'none'
                self.discount = 0
            else
                if self.discount == 0 || self.discount == nil
                    self.discount_type =='none'
                    self.discount = 0
                end
            end

            # Status
            if self.status == 'unfulfilled'
                self.date_fulfilled = nil
            elsif self.status == 'fulfilled' && self.date_fulfilled == nil
                self.status = 'unfulfilled'
                self.date_fulfilled = nil
            end
        end
end