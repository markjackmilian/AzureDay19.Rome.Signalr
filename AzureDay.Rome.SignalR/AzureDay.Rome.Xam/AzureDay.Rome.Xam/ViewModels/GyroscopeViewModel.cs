using System;
using System.Windows.Input;
using Xam.Zero.ViewModels;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.ViewModels
{
    public class GyroscopeViewModel: ZeroBaseModel
    {
        // Set speed delay for monitoring changes.
        private SensorSpeed _speed;

        public int Top { get; set; }
        public int Left { get; set; }
        
        public bool IsGyroscopeActive => Gyroscope.IsMonitoring;
        
        public ICommand ToggleGyroscopeCommand { get; private set; }

        public GyroscopeViewModel()
        {
            _speed = SensorSpeed.UI;
            this.ToggleGyroscopeCommand = new Command(() => InnerToggleGyroscope());
            Gyroscope.ReadingChanged += Gyroscope_ReadingChanged;
        }
        
        private void Gyroscope_ReadingChanged(object sender, GyroscopeChangedEventArgs e)
        {
            var data = e.Reading;
            // Process Angular Velocity X, Y, and Z reported in rad/s
            Console.WriteLine($"Reading: X: {data.AngularVelocity.X}, Y: {data.AngularVelocity.Y}, Z: {data.AngularVelocity.Z}");

            this.Top = (int) data.AngularVelocity.Y;
            this.Left = (int) data.AngularVelocity.X;
        }

        private void InnerToggleGyroscope()
        {
            try
            {
                if (Gyroscope.IsMonitoring)
                    Gyroscope.Stop();
                else
                    Gyroscope.Start(_speed);
            }
            catch (FeatureNotSupportedException fnsEx)
            {
                // Feature not supported on device
            }
            catch (Exception ex)
            {
                // Other error has occurred.
            }
        }
    }
}