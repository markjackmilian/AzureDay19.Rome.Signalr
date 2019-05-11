using System;
using System.Windows.Input;
using AzureDay.Rome.Xam.Services;
using Xam.Zero.ViewModels;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace AzureDay.Rome.Xam.ViewModels
{
    public class GyroscopeViewModel: ZeroBaseModel
    {
        private readonly IMoveItHubService _moveItHubService;

        // Set speed delay for monitoring changes.
        private SensorSpeed _speed;

        public int Top { get; set; }
        public int Left { get; set; }
        
        public bool IsGyroscopeActive => Gyroscope.IsMonitoring;
        
        public ICommand ToggleGyroscopeCommand { get; private set; }

        public GyroscopeViewModel(IMoveItHubService moveItHubService)
        {
            this._moveItHubService = moveItHubService;
            this._speed = SensorSpeed.UI;
            this.ToggleGyroscopeCommand = new Command(() => this.InnerToggleGyroscope());
            Gyroscope.ReadingChanged += this.Gyroscope_ReadingChanged;
        }
        
        private void Gyroscope_ReadingChanged(object sender, GyroscopeChangedEventArgs e)
        {
            var data = e.Reading;
            // Process Angular Velocity X, Y, and Z reported in rad/s
            Console.WriteLine($"Reading: X: {data.AngularVelocity.X}, Y: {data.AngularVelocity.Y}, Z: {data.AngularVelocity.Z}");

            this.Top += (int) data.AngularVelocity.Y;
            this.Left += (int) data.AngularVelocity.X;
        }


        protected override void CurrentPageOnAppearing(object sender, EventArgs e)
        {
            Gyroscope.Start(this._speed);
            base.CurrentPageOnAppearing(sender, e);
        }


        protected override void CurrentPageOnDisappearing(object sender, EventArgs e)
        {
            Gyroscope.Stop();
            base.CurrentPageOnDisappearing(sender, e);
        }

        private void InnerToggleGyroscope()
        {
            try
            {
                if (Gyroscope.IsMonitoring)
                    Gyroscope.Stop();
                else
                    Gyroscope.Start(this._speed);
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
        
        public async void OnTopChanged()
        {
            await this._moveItHubService.SendTop(this.Top);
        }
        
        public async void OnLeftChanged()
        {
            await this._moveItHubService.SendLeft(this.Left);
        }
    }
}