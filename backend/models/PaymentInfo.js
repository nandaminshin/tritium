const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentInfoSchema = new Schema({
    kPay: {
        type: String,
        required: true,
        trim: true,
        default: '123456789'
    },
    wavePay: {
        type: String,
        required: true,
        trim: true,
        default: '987654321'
    },
    ayaPay: {
        type: String,
        required: true,
        trim: true,
        default: '1122334455'
    },
    uabPay: {
        type: String,
        required: true,
        trim: true,
        default: '5566778899'
    },
    additionalPay: {
        type: String,
        trim: true
    },
    coinPrice: {
        type: Number,
        required: true,
        default: 1000,
        min: 0
    }
}, { timestamps: true });

PaymentInfoSchema.statics.getPaymentInfo = async function () {
    const paymentInfo = await this.findOne({});
    if (!paymentInfo) {
        throw new Error('Payment information not found');
    }
    return paymentInfo;
}

// PaymentInfoSchema.statics.createPaymentInfo = async function (paymentData) {
//     const existingPaymentInfo = await this.findOne({});
//     if (existingPaymentInfo) {
//         throw new Error('Payment information already exists');
//     }
//     const paymentInfo = new this(paymentData);
//     await paymentInfo.save();
//     return paymentInfo;
// }

PaymentInfoSchema.statics.updatePaymentInfo = async function (updateData) {
    const paymentInfo = await this.findOne({});
    if (!paymentInfo) {
        throw new Error('Payment information not found');
    }
    Object.assign(paymentInfo, updateData);
    await paymentInfo.save();
    return paymentInfo;
}

// PaymentInfoSchema.statics.deletePaymentInfo = async function () {
//     const paymentInfo = await this.findOne({});
//     if (!paymentInfo) {
//         throw new Error('Payment information not found');
//     }
//     await paymentInfo.remove();
//     return { message: 'Payment information deleted successfully' };
// }

module.exports = mongoose.model('PaymentInfo', PaymentInfoSchema);