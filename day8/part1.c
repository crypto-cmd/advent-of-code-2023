#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SIZE 100000

// Define a struct to hold the data
typedef struct
{
    char key[4];
    char L[4];
    char R[4];
} Data;

// Function to find a data item by key
Data *find_data(Data *data, int size, char *key)
{
    for (int i = 0; i < size; i++)
    {
        if (strcmp(data[i].key, key) == 0)
        {
            return &data[i];
        }
    }
    return NULL;
}
// Function to calculate gcd of two numbers
long long  gcd(long long a, long long b)
{
    if (b == 0)
        return a;
    return gcd(b, a % b);
}

// Function to calculate lcm of two numbers
long long lcm(long long  a, long long b)
{
    long long temp = gcd(a, b);

    return temp ? (a / temp * b) : 0;
}
int main()
{
    printf("Started");
    // // Init
    Data data[MAX_SIZE];
    int size = 0;
    char instructions[MAX_SIZE];
    FILE *input_data = fopen("./day8/input.txt", "r");
    if (input_data == NULL)
    {
        printf("Could not open file\n");
        return 1;
    }
    printf("File opened\n");
    fgets(instructions, MAX_SIZE, input_data);
    instructions[strlen(instructions) - 1] = '\0'; // remove new line
    char line[MAX_SIZE];
    while (fgets(line, MAX_SIZE, input_data))
    {
        if (strcmp(line, "\n") == 0)
            continue;

        char *key = strtok(line, "=");
        for (int i = 0; key[i] != '\0'; i++)
        {
            while (key[i] == ' ' || key[i] == '\n')
            {
                memmove(&key[i], &key[i + 1], strlen(key) - i);
            }
        }
        char *values = strtok(NULL, "=");

        char *L = strtok(values, ",");
        for (int i = 0; L[i] != '\0'; i++)
        {
            while (L[i] == '(' || L[i] == ' ')
            {
                memmove(&L[i], &L[i + 1], strlen(L) - i);
            }
        }
        char *R = strtok(NULL, ",");
        for (int i = 0; R[i] != '\0'; i++)
        {
            while (R[i] == ')' || R[i] == ' ' || R[i] == '\n')
            {
                memmove(&R[i], &R[i + 1], strlen(R) - i);
            }
        }
        strcpy(data[size].key, key);
        strcpy(data[size].L, L);
        strcpy(data[size].R, R);
        size++;
    }
    fclose(input_data);

    // Part 1
    int part_1 = 0;
    char current1[4] = "AAA";
    while (strcmp(current1, "ZZZ") != 0)
    {
        for (int i = 0; i < strlen(instructions); i++)
        {
            Data *found_data = find_data(data, size, current1);
            if (found_data == NULL)
            {
                printf("Key not found: %s\n", current1);
                return 1; // Or handle the error in another way
            }
            if (strcmp(current1, "ZZZ") != 0)
            {
                strcpy(current1, instructions[i] == 'L' ? found_data->L : found_data->R);

                part_1++;
            }
            else
            {
                break;
            }
        }
    }
    printf("%d\n", part_1);

    // Part 2
    Data *current2[MAX_SIZE];
    int csize = 0;
    long long cycles[MAX_SIZE];
    for (int i = 0; i < MAX_SIZE; i++)
    {
        if (&(data[i]) == NULL)
        {
        }
        if ((data[i].key)[2] == 'A')
        {
            current2[csize++] = &(data[i]);
        }
    }
    for (int i = 0; i < csize; i++)
    {
        Data *c = current2[i];
        int cycle = 0;

        while ((c->key)[2] != 'Z')
        {
            cycle++;
            for (int j = 0; j < strlen(instructions); j++)
            {
                char ins = instructions[j];
                if ((c->key)[2] != 'Z')
                {
                    char *nextKey = ins == 'L' ? c->L : c->R;
                    Data *found_data = find_data(data, size, nextKey);
                    if (found_data == NULL)
                    {
                        // break;
                        printf("Key not found: %s\n", nextKey);
                        printf("Coming from: %s\n", c->key);
                        printf("Instruction: %s\n", ins);

                        return 1; // Or handle the error in another way
                    }
                    c = found_data;
                }
                else
                    break;
            }
        }
        cycles[i] = (long long)(cycle * strlen(instructions));
    }
    long long part_2 = cycles[0]; // Start with the first number
    for (int i = 1; i < csize; i++)
    {                                    // size is the number of elements in cycles
        part_2 = lcm(part_2, cycles[i]); // Update part_2 to be the LCM of part_2 and the next number
    }
    printf("Part 2: %lld\n", part_2);
}