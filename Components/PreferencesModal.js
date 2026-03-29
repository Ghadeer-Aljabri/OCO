import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { HexColorPicker } from "react-colorful";



// Manually define missing components
const DialogHeader = ({ children }) => <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{children}</div>;
const DialogTitle = ({ children }) => <h2 style={{ margin: "0" }}>{children}</h2>;
const Button = ({ children, onClick }) => (
  <button style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }} onClick={onClick}>
    {children}
  </button>
);

const eyeFriendlyColors = ["#f5f5f5", "#d8e2dc", "#ffe5d9", "#d6ccc2", "#f1faee", "#e63946", "#1d3557"];

export default function PreferencesModal({ isOpen, onClose }) {
  const [bgColor, setBgColor] = useState("#f5f5f5");
  const [textSize, setTextSize] = useState("md");
  const [textColor, setTextColor] = useState("#333");

  useEffect(() => {
    const brightness = (parseInt(bgColor.substring(1, 3), 16) * 0.299 +
      parseInt(bgColor.substring(3, 5), 16) * 0.587 +
      parseInt(bgColor.substring(5, 7), 16) * 0.114);
    setTextColor(brightness > 186 ? "#333" : "#fff");
  }, [bgColor]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 space-y-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <DialogHeader>
          <DialogTitle>Customize Your Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          <p>Choose Background Color:</p>
          <div className="flex space-x-2">
            {eyeFriendlyColors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => setBgColor(color)}
              />
            ))}
          </div>
          <HexColorPicker color={bgColor} onChange={setBgColor} />
        </div>
        
        <div className="space-y-2">
  <p>Choose Text Size:</p>
  <Select value={textSize} onValueChange={setTextSize}>
    <SelectTrigger className="border p-2 rounded">
      <SelectValue placeholder="Select Text Size" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="sm">Small</SelectItem>
      <SelectItem value="md">Medium</SelectItem>
      <SelectItem value="lg">Large</SelectItem>
    </SelectContent>
  </Select>
</div>
        
        <Button onClick={onClose} className="w-full">Save Preferences</Button>
      </DialogContent>
    </Dialog>
  );
}
