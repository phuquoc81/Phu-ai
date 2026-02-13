// Set current date
document.addEventListener('DOMContentLoaded', function() {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    dateElement.textContent = formattedDate;
    
    // Amount input handler
    const amountInput = document.getElementById('amount');
    const amountWordsElement = document.getElementById('amount-words');
    
    amountInput.addEventListener('input', function(e) {
        const value = parseFloat(e.target.value) || 0;
        // Validate non-negative values
        if (value < 0) {
            e.target.value = 0;
            amountWordsElement.textContent = 'Zero dollars and 00/100';
            return;
        }
        const words = numberToWords(value);
        amountWordsElement.textContent = words;
    });
});

// Convert number to words
function numberToWords(num) {
    if (num === 0) return 'Zero dollars and 00/100';
    
    const dollars = Math.floor(num);
    // Use more robust calculation to avoid floating-point precision errors
    const cents = Math.round(num * 100) % 100;
    
    const dollarsInWords = convertToWords(dollars);
    const centsFormatted = cents.toString().padStart(2, '0');
    
    return `${dollarsInWords} dollars and ${centsFormatted}/100`;
}

function convertToWords(num) {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    function convertHundreds(n) {
        let result = '';
        
        const hundred = Math.floor(n / 100);
        const remainder = n % 100;
        
        if (hundred > 0) {
            result += ones[hundred] + ' Hundred';
            if (remainder > 0) result += ' ';
        }
        
        if (remainder >= 10 && remainder < 20) {
            result += teens[remainder - 10];
        } else {
            const ten = Math.floor(remainder / 10);
            const one = remainder % 10;
            
            if (ten > 0) {
                result += tens[ten];
                if (one > 0) result += '-';
            }
            
            if (one > 0) {
                result += ones[one];
            }
        }
        
        return result;
    }
    
    if (num < 1000) {
        return convertHundreds(num);
    } else if (num < 1000000) {
        const thousands = Math.floor(num / 1000);
        const remainder = num % 1000;
        let result = convertHundreds(thousands) + ' Thousand';
        if (remainder > 0) {
            result += ' ' + convertHundreds(remainder);
        }
        return result;
    } else {
        const millions = Math.floor(num / 1000000);
        const remainder = num % 1000000;
        let result = convertHundreds(millions) + ' Million';
        if (remainder > 0) {
            if (remainder >= 1000) {
                const thousands = Math.floor(remainder / 1000);
                result += ' ' + convertHundreds(thousands) + ' Thousand';
                const lastRemainder = remainder % 1000;
                if (lastRemainder > 0) {
                    result += ' ' + convertHundreds(lastRemainder);
                }
            } else {
                result += ' ' + convertHundreds(remainder);
            }
        }
        return result;
    }
}
