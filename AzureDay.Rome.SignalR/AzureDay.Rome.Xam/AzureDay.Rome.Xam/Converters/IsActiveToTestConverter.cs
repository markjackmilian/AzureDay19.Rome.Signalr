using System;
using System.Globalization;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.Converters
{
    public class IsActiveToTestConverter: IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            var isActive = (bool) value;
            return isActive ? "Enable Gyroscope" : "Disable Gyroscope";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}