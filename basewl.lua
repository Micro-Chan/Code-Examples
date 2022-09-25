_G.key = "324554886267565603717130623217"

local request =  request or syn.request
local funclib = loadstring(game:HttpGet('https://raw.githubusercontent.com/neycoolman555/cool-screpz/main/bukifuncs.lua'))()
local haship = funclib:GrabHashedIP()


local doc = {
    key = _G.key,
    haship = tostring(haship),
    ostime = os.time()
}

local response = request(
    {
        Url = "http://130.61.214.19:9837",  -- This website helps debug HTTP requests
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"  -- When sending JSON, set this!
        },
        Body = game:GetService("HttpService"):JSONEncode(doc)
    }
)

doc = ""
local check = 0
for i,v in pairs(response) do
    if i == "Body" then
        if v == "hwidgay" then check = 1 end
        if v == "xaea12" then check = 2 end
    end
end

if check == 0 then 
    while true do end
elseif check == 1 then
    game:GetService("Players").LocalPlayer:Kick("HWID can only be changed every 24 hours!")
elseif check == 2 then

    
else
    game:GetService("Players").LocalPlayer:Kick("Unknown error occurred")
end
