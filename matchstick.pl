mutation(1, 7).
mutation(3, 9).
mutation(5, 6).
mutation(5, 9).
mutation(6, 8).
mutation(9, 8).
mutation(0, 8).

% Предикат, який перетворює число на список цифр
transform(Number, List) :-  
    transform_helper(Number, [], List). 

transform_helper(0, Acc, Acc) :- !. 
transform_helper(Number, Acc, List) :-
    Digit is Number mod 10,
    NextNumber is Number // 10,
    transform_helper(NextNumber, [Digit|Acc], List).

% Предикат, який перетворює список цифр на число   
reverse_transform(List, Number) :-       
    reverse_transform_helper(List, 0, Number). 

reverse_transform_helper([], Acc, Acc) :- !.   
reverse_transform_helper([Digit|Tail], Acc, Number) :-
    NewAcc is Acc * 10 + Digit,  
    reverse_transform_helper(Tail, NewAcc, Number).    

% Предиакт, який змінює число згідно з правилом
mutate_number(Number, MutatedNumber) :-
    Number < 0, 
    MutatedNumber is -Number.

mutate_number(Number, MutatedNumber) :- 
    transform(Number, ListedNumber),
    mutate_list(ListedNumber, MutatedListedNumber),
    reverse_transform(MutatedListedNumber, MutatedNumber),
    Number \= MutatedNumber,
    Number >= 0.

mutate_number(Number, MinusMutatedNumber) :-
    Number < 0,
    transform(-Number, ListedNumber),
    mutate_list(ListedNumber, MutatedListedNumber),
    reverse_transform(MutatedListedNumber, MutatedNumber),
    Number \= -MutatedNumber,
    MinusMutatedNumber = - MutatedNumber.

% Предикат, який змінює одну з цифр у списку
mutate_list([], []).

mutate_list([X|Xs], [Y|Xs]) :-
    mutation(X, Y),
    [X|Xs] \= [Y|Xs].

mutate_list([X|Xs], [X|Ys]) :-
    mutate_list(Xs, Ys).

% Предикат, який змінює одне з чисел у списку
mutate_number_list([], []).

mutate_number_list([X|Xs], [Y|Xs]) :-
    mutate_number(X, Y),
    X \= Y.

mutate_number_list([X|Xs], [X|Ys]) :-
    mutate_number_list(Xs, Ys).

% предикат, який перевіряє чи сума всіх перших елементів списку дорівнює останньому елементу
sum_first_eq_last(List) :-
    last(List, Last),
    append(Firsts, [Last], List),
    sumlist(Firsts, Sum),
    Sum = Last.

solve(List, Solved) :-
    mutate_number_list(List, Solved),
    sum_first_eq_last(Solved).

% https://stackoverflow.com/questions/36340495/prolog-generate-list-with-random-values


gen_list(C, Y) :- findnsols(C, U, (repeat, random(-40, 40, U)), Y).

% предикат, який генерує головоломку вказаної довжини
gen_riddle(0, []).
gen_riddle(Length, GeneratedList) :-
    gen_list(Length, GeneratedList),
    not(sum_first_eq_last(GeneratedList)),
    solve(GeneratedList, _).