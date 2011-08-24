View.prototype.i18n = {
};

View.prototype.i18n.defaultLocale = "en_US";

View.prototype.i18n.supportedLocales = [
                                        "en_US","ja"
                                        ];

/**
 * key is the key used to lookup the value in i18n_XX.js file
 * locale is which locale to use. will be appended in i18n_[locale].js
 * if local does not exist, use defaultLocale
 * if key is not found, use defaultLocale's values
 */
View.prototype.i18n.getString = function(key,locale) {
	// if specified locale does not exist, use default locale
	if (View.prototype.i18n.supportedLocales.indexOf(locale) == -1) {
		locale = View.prototype.i18n.defaultLocale;
	}
	if (this[locale][key] !== undefined) {
		return this[locale][key].value;
	} else {
		return this[View.prototype.i18n.defaultLocale][key].value;		
	}
};

/**
 * Injects provided params into the translated string
 * key is the key used to lookup the value in i18n_XX.js file
 * locale is which locale to use. will be appended in i18n_[locale].js
 * params is an array of values to replace in the translated string.
 * the translated string should have the same number of replaceable elements as in the params
 * ex. params: ['goodbye', 'hello']
 * translated string: 'You say {0}, I say {1}'
 * if local does not exist, use defaultLocale
 * if key is not found, use defaultLocale's values
 */
View.prototype.i18n.getStringWithParams = function(key,locale,params) {
	// first get translated string
	var translatedString = this.getString(key,locale);
	
	// then go through the string and replace {0} with paramas[0], {1} with params[1], etc.
	for (var i=0; i< params.length; i++) {
		var lookupString = "{"+i+"}";
		var replaceString = params[i];
		translatedString = translatedString.replace(lookupString,replaceString);
	}
	return translatedString;
};

// retrieve i18n files for each supported locale 
for (var i=0; i < View.prototype.i18n.supportedLocales.length; i++) {
	var locale = View.prototype.i18n.supportedLocales[i];
	var localePath = "view/i18n/i18n_" + locale + ".js";
	$.ajax({"url":localePath,success:function(){},error:function(){}});
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/i18n/view_i18n.js');
};