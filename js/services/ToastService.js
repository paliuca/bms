'use strict';

module.exports = ["ngToast", function(ngToast) {
    return {
        create: function(message, className){
			ngToast.create({
				className: className,
				content: message,
				dismissButton: true,
				dismissButtonHtml: '&times;'
			});        	
        }
    }
}];