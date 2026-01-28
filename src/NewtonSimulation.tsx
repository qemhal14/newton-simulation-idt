import React, { useState, useEffect, useRef, useCallback } from 'react';
// MUI Components
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

// MUI Icons
import ScienceIcon from '@mui/icons-material/Science';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublicIcon from '@mui/icons-material/Public';
import CloseIcon from '@mui/icons-material/Close';

// --- Types ---
type TabType = 'hammer' | 'orbit';

interface ImpactData {
  force: number;
  active: boolean;
}

// --- Main Component ---
const NewtonLab = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hammer');
  const [showInfo, setShowInfo] = useState(true);

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newTab: TabType | null) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: '#1a237e', 
          color: 'white',
          borderRadius: 0,
          zIndex: 10
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <ScienceIcon color="info" />
          <Typography variant="h6" component="h1" fontWeight="bold">
            Newton's 3rd Law Lab
          </Typography>
        </Stack>

        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="simulation scenarios"
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}
        >
          <ToggleButton value="hammer" sx={{ color: 'white', '&.Mui-selected': { bgcolor: 'white', color: '#1a237e' } }}>
            <ConstructionIcon sx={{ mr: 1, fontSize: 18 }} />
            Example 1: Contact Force
          </ToggleButton>
          <ToggleButton value="orbit" sx={{ color: 'white', '&.Mui-selected': { bgcolor: 'white', color: '#1a237e' } }}>
            <PublicIcon sx={{ mr: 1, fontSize: 18 }} />
            Example 2: Non-contact Force
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeTab === 'hammer' ? <HammerSimulation /> : <OrbitSimulation />}
      </Box>

      {/* Floating Info Box */}
      <Fade in={showInfo}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoOutlinedIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2" color="primary.dark" fontWeight="bold">
                Key Concept
              </Typography>
            </Stack>
            <IconButton size="small" onClick={() => setShowInfo(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" paragraph fontWeight="bold">
              Action and Reaction
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For every action, there is an equal and opposite reaction.
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '0.875rem', color: '#666' }}>
              <li>Forces always come in pairs.</li>
              <li>They are equal in magnitude.</li>
              <li>They act in opposite directions.</li>
            </ul>
          </Box>
        </Paper>
      </Fade>

      {!showInfo && (
        <IconButton
          onClick={() => setShowInfo(true)}
          color="primary"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24, 
            bgcolor: 'primary.main', 
            color: 'white', 
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 3
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      )}
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* SCENARIO 1: HAMMER (Contact Force)                                       */
/* -------------------------------------------------------------------------- */

const HammerSimulation = () => {
  const [mass, setMass] = useState<number>(5);
  const [velocity, setVelocity] = useState<number>(5);
  const [isStriking, setIsStriking] = useState(false);
  const [impactData, setImpactData] = useState<ImpactData>({ force: 0, active: false });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const stateRef = useRef({ 
    hammerY: 100, 
    nailY: 300, 
    phase: 'idle', // idle, down, contact, up
    impactTimer: 0,
    targetNailY: 0
  });

  const GROUND_Y = 350;
  const NAIL_HEAD_Y_INITIAL = 300;
  
  // Calculate Force (Impulse approximation)
  const calculateForce = () => Math.round(mass * velocity * 20); 

  const handleStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    stateRef.current.phase = 'down';
    setImpactData({ force: 0, active: false });
  };

  const reset = () => {
    setIsStriking(false);
    stateRef.current = { 
      hammerY: 100, 
      nailY: NAIL_HEAD_Y_INITIAL, 
      phase: 'idle', 
      impactTimer: 0,
      targetNailY: 0 
    };
    setImpactData({ force: 0, active: false });
  };

  // --- Animation Loop ---
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const state = stateRef.current;
    
    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background/Ground
    ctx.fillStyle = '#eeeeee'; 
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#5d4037'; // Ground Brown
    ctx.fillRect(0, GROUND_Y, width, height - GROUND_Y);
    
    // 2. Logic Update
    let hammerY = state.hammerY;
    const targetY = state.nailY - 50; // Hammer rests on top of nail (head height)

    if (state.phase === 'down') {
      const speed = velocity * 2.5; 
      state.hammerY += speed;
      
      if (state.hammerY >= targetY) {
        state.hammerY = targetY;
        state.phase = 'contact';
        state.impactTimer = 0;
        
        // Impact Logic
        const forceVal = calculateForce();
        setImpactData({ force: forceVal, active: true });
        
        // Nail penetration depth
        const depth = Math.min(35, forceVal / 50); 
        state.targetNailY = Math.min(GROUND_Y - 10, state.nailY + depth);
      }
    } else if (state.phase === 'contact') {
      state.impactTimer++;
      
      // Animate nail driving in
      if (state.nailY < state.targetNailY) {
          state.nailY += 3;
          state.hammerY += 3; // Hammer follows nail
      }

      // HOLD TIME: 120 frames (~2 seconds)
      if (state.impactTimer > 120) { 
        state.phase = 'up';
        setImpactData(prev => ({ ...prev, active: false }));
      }
    } else if (state.phase === 'up') {
      state.hammerY -= 8;
      if (state.hammerY <= 100) {
        state.hammerY = 100;
        state.phase = 'idle';
        setIsStriking(false);
      }
    }

    hammerY = state.hammerY;

    // 3. Draw Nail
    const nailX = width / 2;
    const nailHeight = 60;
    
    ctx.fillStyle = '#90a4ae'; // Steel Blue/Grey
    ctx.beginPath();
    // Nail body
    ctx.fillRect(nailX - 4, state.nailY, 8, nailHeight);
    // Nail head
    ctx.fillStyle = '#607d8b';
    ctx.fillRect(nailX - 10, state.nailY, 20, 6);
    
    // 4. Draw Hammer (HORIZONTAL)
    // Head (The heavy metal part hitting the nail)
    ctx.fillStyle = '#455a64'; // Dark metal
    const headWidth = 60;
    const headHeight = 50;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(nailX - headWidth/2, hammerY, headWidth, headHeight, 4);
    } else {
      ctx.fillRect(nailX - headWidth/2, hammerY, headWidth, headHeight);
    }
    ctx.fill();

    // Handle (Extending to the Right)
    ctx.fillStyle = '#8d6e63'; // Wood
    const handleLen = 140;
    const handleThick = 24;
    ctx.fillRect(nailX + headWidth/2 - 5, hammerY + (headHeight - handleThick)/2, handleLen, handleThick);
    
    // Handle Grip (Detail)
    ctx.fillStyle = '#3e2723'; // Darker wood/rubber
    ctx.fillRect(nailX + headWidth/2 + handleLen - 40, hammerY + (headHeight - handleThick)/2, 40, handleThick);

    // 5. Draw Forces (Vectors)
    if (state.phase === 'contact') {
      const forceMag = calculateForce();
      const arrowLength = Math.min(100, forceMag / 15); 

      // F_H: Force of Hammer on Nail (Down) - Label on Right
      drawArrow(ctx, nailX + 50, state.nailY, nailX + 50, state.nailY + arrowLength, '#d32f2f', 'FH (Action)', 'right');
      
      // F_N: Force of Nail on Hammer (Up) - Label on LEFT
      drawArrow(ctx, nailX - 50, state.nailY, nailX - 50, state.nailY - arrowLength, '#1976d2', 'FN (Reaction)', 'left');
    }

  }, [mass, velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <Stack direction="row" sx={{ width: '100%', height: '100%' }}>
      {/* Controls Sidebar */}
      <Paper elevation={2} sx={{ width: 320, p: 3, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5, borderRadius: 0 }}>
        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">Controls</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust the properties of the hammer to observe the force interaction upon impact.
          </Typography>

          <ControlSlider 
            label="Hammer Mass (kg)" 
            value={mass} 
            onChange={setMass} 
            min={1} max={10} 
            disabled={isStriking} 
          />
          <ControlSlider 
            label="Swing Velocity (m/s)" 
            value={velocity} 
            onChange={setVelocity} 
            min={1} max={10} 
            disabled={isStriking} 
          />
        </Box>

        <Stack direction="row" spacing={2} mt="auto">
          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={handleStrike} 
            disabled={isStriking}
            startIcon={<PlayArrowIcon />}
          >
            Strike
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            onClick={reset} 
            disabled={isStriking}
          >
            <ReplayIcon />
          </Button>
        </Stack>
      </Paper>

      {/* Canvas Area */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: '#eeeeee' }}>
        {/* Data Overlay */}
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ position: 'absolute', top: 24, left: 24, zIndex: 5 }}
        >
          <DataCard 
            title="Force on Nail (Action)" 
            value={impactData.active ? `${impactData.force} N` : '--'} 
            color="#d32f2f" 
          />
          <Typography variant="h4" sx={{ alignSelf: 'center', color: '#9e9e9e' }}>=</Typography>
          <DataCard 
            title="Force on Hammer (Reaction)" 
            value={impactData.active ? `${impactData.force} N` : '--'} 
            color="#1976d2" 
          />
        </Stack>

        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        {!isStriking && !impactData.active && (
           <Alert severity="info" sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
             Click <strong>STRIKE</strong> to start experiment
           </Alert>
        )}
      </Box>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/* SCENARIO 2: ORBIT (Non-Contact Force)                                    */
/* -------------------------------------------------------------------------- */

const OrbitSimulation = () => {
  const [earthMass, setEarthMass] = useState(5);
  const [moonMass, setMoonMass] = useState(2);
  const [distance, setDistance] = useState(200);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const angleRef = useRef(0);

  const calculateGravity = () => {
    // F = G * m1 * m2 / r^2 (Scaled)
    const G = 2000; 
    return Math.round((G * earthMass * moonMass) / (distance * 0.5));
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Dynamic background (stars)
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0,0, width, height);
    
    // Tiny stars
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for(let i=0; i<30; i++) {
        const x = (centerX + (i*97)) % width;
        const y = (centerY + (i*131)) % height;
        ctx.fillRect(x,y, 1, 1);
    }
    
    // Orbital update
    angleRef.current += 0.005 + (100/distance) * 0.005;

    // Objects
    const earthRadius = 25 + earthMass * 3;
    const moonRadius = 10 + moonMass * 2;
    
    const moonX = centerX + Math.cos(angleRef.current) * distance;
    const moonY = centerY + Math.sin(angleRef.current) * distance;

    // 1. Draw Orbit Path
    ctx.beginPath();
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([5, 5]);
    ctx.arc(centerX, centerY, distance, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Interaction Field Line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(moonX, moonY);
    ctx.stroke();

    // 3. Draw Force Vectors
    const forceMag = calculateGravity();
    const arrowLength = Math.min(distance - earthRadius - moonRadius - 10, forceMag / 5);

    // F_E (Earth pulls Moon) - Action
    const angleToEarth = Math.atan2(centerY - moonY, centerX - moonX);
    drawArrow(
      ctx, moonX, moonY, 
      moonX + Math.cos(angleToEarth) * arrowLength, 
      moonY + Math.sin(angleToEarth) * arrowLength, 
      '#ef5350', 'FE'
    );

    // F_M (Moon pulls Earth) - Reaction
    const angleToMoon = Math.atan2(moonY - centerY, moonX - centerX);
    drawArrow(
      ctx, centerX, centerY, 
      centerX + Math.cos(angleToMoon) * arrowLength, 
      centerY + Math.sin(angleToMoon) * arrowLength, 
      '#42a5f5', 'FM'
    );

    // 4. Draw Earth (Textured)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
    ctx.clip(); // Clip everything to Earth circle
    
    // Ocean
    ctx.fillStyle = '#2196f3'; 
    ctx.fillRect(centerX - earthRadius, centerY - earthRadius, earthRadius*2, earthRadius*2);
    
    // Continents (Simple blobs)
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.arc(centerX - earthRadius*0.3, centerY - earthRadius*0.2, earthRadius*0.6, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + earthRadius*0.4, centerY + earthRadius*0.4, earthRadius*0.5, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + earthRadius*0.2, centerY - earthRadius*0.5, earthRadius*0.4, 0, Math.PI*2);
    ctx.fill();

    // Shadow/Atmosphere
    const grad = ctx.createRadialGradient(centerX - earthRadius/3, centerY - earthRadius/3, earthRadius/2, centerX, centerY, earthRadius);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = grad;
    ctx.fillRect(centerX - earthRadius, centerY - earthRadius, earthRadius*2, earthRadius*2);
    
    ctx.restore(); // Restore clipping
    
    // Earth Outer Glow/Stroke
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(66, 165, 245, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Draw Moon (Textured)
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // Base color
    ctx.fillStyle = '#cfd8dc'; 
    ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius*2, moonRadius*2);
    
    // Craters
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath(); ctx.arc(moonX - moonRadius*0.3, moonY - moonRadius*0.2, moonRadius*0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX + moonRadius*0.4, moonY + moonRadius*0.1, moonRadius*0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(moonX, moonY + moonRadius*0.5, moonRadius*0.15, 0, Math.PI*2); ctx.fill();
    
    // Shadow
    const mGrad = ctx.createRadialGradient(moonX - moonRadius/3, moonY - moonRadius/3, moonRadius/2, moonX, moonY, moonRadius);
    mGrad.addColorStop(0, 'rgba(255,255,255,0)');
    mGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = mGrad;
    ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius*2, moonRadius*2);

    ctx.restore();

  }, [earthMass, moonMass, distance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      draw(ctx);
      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <Stack direction="row" sx={{ width: '100%', height: '100%' }}>
      {/* Controls */}
      <Paper elevation={2} sx={{ width: 320, p: 3, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5, borderRadius: 0 }}>
        <Box>
          <Typography variant="h6" gutterBottom fontWeight="bold">Gravity Controls</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust masses and distance. Observe that the force arrows remain identical in length.
          </Typography>

          <ControlSlider 
            label="Earth Mass (M1)" 
            value={earthMass} 
            onChange={setEarthMass} 
            min={1} max={10} 
          />
          <ControlSlider 
            label="Moon Mass (M2)" 
            value={moonMass} 
            onChange={setMoonMass} 
            min={1} max={10} 
          />
          <ControlSlider 
            label="Distance (r)" 
            value={distance} 
            onChange={setDistance} 
            min={120} max={300} 
          />
        </Box>

        <Alert severity="success" sx={{ mt: 'auto' }}>
          <strong>Discovery:</strong> Notice that even if the Earth is massive, the pull it feels from the Moon is exactly equal to the pull it exerts on the Moon.
        </Alert>
      </Paper>

      {/* Canvas */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: '#0f172a' }}>
         <Stack 
          direction="row" 
          spacing={2} 
          sx={{ position: 'absolute', top: 24, left: 24, zIndex: 5 }}
        >
          <DataCard 
            title="Force on Moon (Action)" 
            value={`${calculateGravity()} G`} 
            color="#ef5350" 
            dark
          />
          <Typography variant="h4" sx={{ alignSelf: 'center', color: '#64748b' }}>=</Typography>
          <DataCard 
            title="Force on Earth (Reaction)" 
            value={`${calculateGravity()} G`} 
            color="#42a5f5" 
            dark
          />
        </Stack>

        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        
        <Box sx={{ position: 'absolute', bottom: 20, right: 20, bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: 1 }}>
           <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
             F ∝ (m1 × m2) / r²
           </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/* SHARED UTILS & COMPONENTS                                                */
/* -------------------------------------------------------------------------- */

const ControlSlider = ({ label, value, onChange, min, max, disabled = false }: any) => (
  <Box sx={{ mb: 3, opacity: disabled ? 0.5 : 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="subtitle2" color="text.primary">{label}</Typography>
      <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, borderRadius: 1, fontFamily: 'monospace' }}>
        {value}
      </Typography>
    </Box>
    <Slider
      value={value}
      onChange={(_, v) => onChange(v as number)}
      min={min}
      max={max}
      disabled={disabled}
      size="small"
      valueLabelDisplay="auto"
    />
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" color="text.disabled">Low</Typography>
      <Typography variant="caption" color="text.disabled">High</Typography>
    </Box>
  </Box>
);

const DataCard = ({ title, value, color, dark = false }: any) => (
  <Card 
    sx={{ 
      minWidth: 160, 
      bgcolor: dark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(8px)',
      boxShadow: 3
    }}
  >
    <CardContent sx={{ p: '16px !important' }}>
      <Typography variant="caption" sx={{ color: dark ? 'grey.400' : 'text.secondary', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: color, fontWeight: 'bold', fontFamily: 'monospace', mt: 0.5 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string, align: 'left' | 'right' = 'right') => {
  const headlen = 12;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  
  // Line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
  ctx.fill();

  // Label
  ctx.font = "bold 14px Roboto, Arial";
  ctx.fillStyle = color;
  
  if (align === 'left') {
    const textWidth = ctx.measureText(label).width;
    // Shift left by width + padding (15)
    ctx.fillText(label, toX - textWidth - 15, toY + 5);
  } else {
    // Default right side placement
    ctx.fillText(label, toX + 15, toY + 5);
  }
};

export default NewtonLab;