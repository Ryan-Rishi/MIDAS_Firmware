# gui_map.py
import tkinter as tk
from tkinter import ttk
import folium
import webbrowser
import queue
import threading
import audioProcessing

coordinate_queue = queue.Queue()

def setup_map():
    global m
    m = folium.Map(zoom_start=13)  # Start with a default zoom level, location will be set dynamically.
    m.save('map.html')

def add_marker(latitude, longitude):
    global m
    m = folium.Map(location=[latitude, longitude], zoom_start=13)  # Set the map to the received location.
    folium.Marker([latitude, longitude]).add_to(m)
    m.save('map.html')
    webbrowser.open('map.html')

def gui_add_marker():
    print("GUI: Attempting to add a marker.")
    try:
        latitude, longitude = coordinate_queue.get_nowait()
        print(f"GUI: Retrieved coordinates: {latitude}, {longitude}")
        add_marker(latitude, longitude)  # Use retrieved coordinates
    except queue.Empty:
        print("GUI: No coordinates to add.")

def main():
    root = tk.Tk()
    root.title("Sound Marker Map")

    ttk.Button(root, text="Add Marker", command=gui_add_marker).pack()

    setup_map()
    print("Starting the GUI and Audio Processing.")
    audio_thread = threading.Thread(target=audioProcessing.start_audio_stream, args=(gui_add_marker, coordinate_queue,))
    audio_thread.daemon = True
    audio_thread.start()

    root.mainloop()

if __name__ == "__main__":
    main()