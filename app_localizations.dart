import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppLocalizations {
  AppLocalizations(this.locale, this._values);
  final Locale locale;
  final Map<String, dynamic> _values;

  static const supportedLocales = [
    Locale('sv'), Locale('en'), Locale('sq'), Locale('el'),
  ];

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  String t(String key) => _values[key]?.toString() ?? key;

  static Future<AppLocalizations> load(Locale locale) async {
    final jsonString = await rootBundle.loadString('assets/translations/${locale.languageCode}.json');
    return AppLocalizations(locale, json.decode(jsonString) as Map<String, dynamic>);
  }
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return AppLocalizations.supportedLocales.map((e) => e.languageCode).contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) => AppLocalizations.load(locale);

  @override
  bool shouldReload(covariant LocalizationsDelegate<AppLocalizations> old) => false;
}
