import os

filename = input("Please enter the filename: ")
filename = os.path.join("tasks/", "task" + filename)
print(filename)

#with open(filename, 'w') as f:
    #f.write("Hello World")