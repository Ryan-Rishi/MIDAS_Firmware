import pyaudio
import math
import audioop
import numpy as np

# Constants
FORMAT = pyaudio.paInt16  # Audio format
CHANNELS = 1  # Mono audio
RATE = 44100  # Sampling rate
CHUNK = 1024  # Block size
AUDIO_DURATION = 5  # Duration to capture in seconds
MIC_SENSITIVITY = 24  # Microphone sensitivity in dB (example value, adjust accordingly)
MIC_CALIBRATION_DISTANCE = 1  # Calibration distance in meters

def estimate_distance(db_level, sensitivity=MIC_SENSITIVITY, calibration_distance=MIC_CALIBRATION_DISTANCE):
    """
    Estimate distance from the source based on dB level.
    This is a simplified calculation and should be calibrated and adjusted for accurate use.
    """
    # Convert dB level back to a linear scale
    intensity = 10 ** (db_level / 10)
    
    # Assuming the intensity drops with the square of the distance (inverse square law)
    # and calibrating with a known distance
    estimated_distance = calibration_distance * math.sqrt(10 ** (sensitivity / 10) / intensity)
    return estimated_distance

def capture_and_process_audio(audio_duration=AUDIO_DURATION):
    p = pyaudio.PyAudio()

    # Open stream
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    print(f"Capturing audio for {audio_duration} seconds...")

    frames = []
    for _ in range(0, int(RATE / CHUNK * audio_duration)):
        data = stream.read(CHUNK)
        frames.append(data)

        # Calculate RMS power and dB level
        rms = audioop.rms(data, 2)  # RMS of the block
        db = 20 * math.log10(rms)  # Convert RMS to dB

        # Estimate distance
        distance = estimate_distance(db)

        print(f"RMS Power: {rms}, dB Level: {db:.2f} dB, Estimated Distance: {distance:.2f} meters")

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    p.terminate()

    print("Audio capturing completed.")

if __name__ == "__main__":
    capture_and_process_audio()
