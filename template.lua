local mainframe
local Material = loadstring(game:HttpGet("https://raw.githubusercontent.com/Kinlei/MaterialLua/master/Module.lua"))()

function LoadUI()
    if not SUGON_LOADED then
        pcall(function() getgenv().SUGON_LOADED = true end)
        mainframe = Material.Load({
            Title = "sugon",
            Style = 3,
            SizeX = 500,
            SizeY = 350,
            Theme = "Jester",
            ColorOverrides = {
                MainFrame = Color3.fromRGB(3,69,123)
            }
        })
    end
    game:GetService"UserInputService".InputBegan:Connect(function(input,gpe)
        if input.KeyCode == Enum.KeyCode["RightControl"] and not gpe then
            game:GetService("CoreGui").sugon.MainFrame.Visible = not game:GetService("CoreGui").test.MainFrame.Visible
        end
    end)
--config page
    local functionlist = {}
   
    local configpage = mainframe.New({
        Title = "Config"
    })
    configpage.Button({
        Text = "Destroy UI",
        Callback = function()
            for i,v in next, functionlist do
                if type(v) == "function" then
                    v.SetState(false)
                end
            end
            game:GetService("CoreGui").sugon:Destroy()
        end    
    })
    local style
    configpage.Dropdown({
        Text = "Style",
        Callback = function(value)
            style = value
        end,
        Options = {
            1,2,3
        }
    })
    local theme
    configpage.Dropdown({
        Text = "Theme",
        Callback = function(value)
            theme = value
        end,
        Options = {
            "Light","Dark","Mocha","Jester","Aqua"
        }
    })
    local UIBGCOLOR
    configpage.ColorPicker({
        Text = "UI BGColour",
        Default = Color3.fromRGB(255,255,255),
        Callback = function(Value)
            UIBGCOLOR = Color3.fromRGB(Value.R * 255, Value.G * 255, Value.B * 255)
        end
    })

    configpage.Button({
        Text = "Reload UI",
        Callback = function()
            mainframe = Material.Load({
                Title = "test",
                Style = style,
                SizeX = 500,
                SizeY = 350,
                Theme = theme,
                ColorOverrides = {
                    MainFrame = UIBGCOLOR
                }
            })
            LoadUI()
        end
    })
end

LoadUI()
