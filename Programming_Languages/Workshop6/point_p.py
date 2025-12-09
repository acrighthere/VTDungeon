import ctypes
import os
import time

import ctypes
import os
import random

class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_int), ("y", ctypes.c_int)]

def generate_points_file(path="points.txt", count=1000):
    with open(path, "w") as f:
        for _ in range(count):
            x1, y1 = random.randint(0, 50), random.randint(0, 50)
            x2, y2 = random.randint(0, 50), random.randint(0, 50)
            f.write(f"{x1},{y1} {x2},{y2}\n")

def load_points(path="points.txt"):
    points = []
    with open(path) as f:
        for line in f:
            a, b = line.split()
            x1, y1 = map(int, a.split(","))
            x2, y2 = map(int, b.split(","))
            points.append(Point(x1, y1))
            points.append(Point(x2, y2))
    return points

if __name__ == "__main__":
    generate_points_file()
    points = load_points()
    pairs_count = len(points) // 2

    lib_name = "point_lib.dll" if os.name == 'nt' else "point_lib.so"
    lib_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), lib_name)

    c_lib = ctypes.CDLL(lib_path)

    c_lib.process_pairs.argtypes = [
        ctypes.POINTER(Point),
        ctypes.c_int
    ]
    c_lib.process_pairs.restype = ctypes.POINTER(ctypes.c_double)

    ArrayType = Point * len(points)
    c_array = ArrayType(*points)

    result_ptr = c_lib.process_pairs(c_array, pairs_count)

    distances = [result_ptr[i] for i in range(pairs_count)]

    # free()
    libc = ctypes.CDLL("msvcrt.dll") if os.name == "nt" else ctypes.CDLL("libc.so.6")
    libc.free(result_ptr)

    print("Первые 10 расстояний:")
    print(distances[:10])


